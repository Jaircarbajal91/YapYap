const express = require("express");
const { Message, User, Image, Server } = require("../../db/models");
const { deleteFile } = require("../../awsS3");

const router = express.Router();

// Helper function to safely delete a message image from S3
// Only deletes if the image is of type "message" and not used elsewhere
const deleteMessageImage = async (imageId) => {
  if (!imageId) return;

  try {
    const image = await Image.findByPk(imageId);
    if (!image) return;

    // Only delete images that are specifically for messages
    if (image.type !== "message") return;

    // Check if image is used by any other message
    const otherMessages = await Message.findOne({
      where: { imageId: imageId },
    });

    // Check if image is used by any user or server
    const usedByUser = await User.findOne({ where: { imageId: imageId } });
    const usedByServer = await Server.findOne({ where: { imageId: imageId } });

    // Only delete if not used elsewhere
    if (!otherMessages && !usedByUser && !usedByServer) {
      // Delete from S3
      await deleteFile(image.url);
      // Delete from database
      await image.destroy();
    }
  } catch (error) {
    console.error("Error deleting message image:", error);
    // Don't throw - we don't want to fail the message operation if image deletion fails
  }
};

const checkAuth = (req, res, next) =>
  !req.user
    ? next(new Error("Please log in or register to access this information."))
    : next();

// Add a message to the database
router.post("/", checkAuth, async (req, res) => {
  const { message, senderId, channelId, dmId, imageId } = req.body;
  const io = req.app.get('io');

  const newMessage = await Message.create({
    message,
    senderId,
    channelId,
    dmId,
    imageId,
  });

  const messageWithUser = await Message.findByPk(newMessage.id, {
    include: [{ model: User }],
  });

  const messageJson = messageWithUser?.toJSON() || newMessage.toJSON();

  let image = null;
  if (messageJson.imageId) {
    const imageRecord = await Image.findByPk(messageJson.imageId);
    image = imageRecord ? imageRecord.url : null;
  }

  const messageWithImage = {
    ...messageJson,
    image,
  };

  // Emit socket event for live message updates
  if (io) {
    // Determine the room for socket emission
    const room = channelId ? `channel-${channelId}` : dmId ? `dm-${dmId}` : null;
    
    if (room) {
      io.to(room).emit("receivedMessage", {
        message: messageWithImage,
      });
    }
  }

  return res.json(messageWithImage);
});

// get all messages for a dm
router.get("/dm/:dmId", async (req, res) => {
  const { dmId } = req.params;
  let messages = await Message.findAll({
    where: { dmId },
  });
  messages = await Promise.all(
    messages.map(async (message) => {
      const sender = await User.findByPk(message.senderId, {
        include: [{ model: Image }]
      });
      const image = await Image.findByPk(message.imageId);
      return { ...message.dataValues, User: sender, image: image ? image.url : null };
    })
  );
  return res.json({ messages });
});

// Update a message
router.put("/:messageId", checkAuth, async (req, res) => {
  const { messageId } = req.params;
  const { message, imageId, removeImage } = req.body;
  const userId = req.user.id;
  const io = req.app.get('io');

  try {
    const messageRecord = await Message.findByPk(messageId);
    
    if (!messageRecord) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user is the sender
    if (messageRecord.senderId !== userId) {
      return res.status(403).json({ error: "You can only edit your own messages" });
    }

    const oldImageId = messageRecord.imageId;
    const channelId = messageRecord.channelId;
    const dmId = messageRecord.dmId;

    // Update message text if provided
    if (message !== undefined) {
      messageRecord.message = message;
    }

    // Handle image changes
    if (removeImage === true) {
      // Remove image from message
      messageRecord.imageId = null;
      // Delete the old image if it exists
      if (oldImageId) {
        await deleteMessageImage(oldImageId);
      }
    } else if (imageId !== undefined) {
      // Set new image (or null to remove)
      if (imageId !== messageRecord.imageId && oldImageId) {
        // Delete old image if it's being replaced
        await deleteMessageImage(oldImageId);
      }
      messageRecord.imageId = imageId;
    }

    await messageRecord.save();

    const messageWithUser = await Message.findByPk(messageRecord.id, {
      include: [{ model: User }],
    });

    const messageJson = messageWithUser?.toJSON() || messageRecord.toJSON();

    let image = null;
    if (messageJson.imageId) {
      const imageRecord = await Image.findByPk(messageJson.imageId);
      image = imageRecord ? imageRecord.url : null;
    }

    const messageWithImage = {
      ...messageJson,
      image,
    };

    // Emit socket event for live message updates
    if (io) {
      // Determine the room for socket emission
      const room = channelId ? `channel-${channelId}` : dmId ? `dm-${dmId}` : null;
      
      if (room) {
        io.to(room).emit("messageUpdated", {
          message: messageWithImage,
        });
      }
    }

    return res.json(messageWithImage);
  } catch (error) {
    console.error("Error updating message:", error);
    return res.status(500).json({ error: "Failed to update message" });
  }
});

// Delete a message
router.delete("/:messageId", checkAuth, async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;
  const io = req.app.get('io');

  try {
    const messageRecord = await Message.findByPk(messageId);
    
    if (!messageRecord) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if user is the sender
    if (messageRecord.senderId !== userId) {
      return res.status(403).json({ error: "You can only delete your own messages" });
    }

    const imageId = messageRecord.imageId;
    const channelId = messageRecord.channelId;
    const dmId = messageRecord.dmId;

    // Determine the room for socket emission
    const room = channelId ? `channel-${channelId}` : dmId ? `dm-${dmId}` : null;

    // Delete the message
    await messageRecord.destroy();

    // Delete associated image from S3 if it exists
    if (imageId) {
      await deleteMessageImage(imageId);
    }

    // Emit socket event for live deletion
    if (io && room) {
      io.to(room).emit("messageDeleted", {
        messageId,
      });
    }

    return res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({ error: "Failed to delete message" });
  }
});

module.exports = router;
