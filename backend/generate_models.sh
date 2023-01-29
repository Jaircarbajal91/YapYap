npx sequelize-cli model:generate --name User --attributes username:string,email:string,hashedPassword:string,alias:string,imageId:integer
npx sequelize-cli model:generate --name ChatMember --attributes userId:integer,chatId:integer,dmId:integer
npx sequelize-cli model:generate --name Server --attributes server_name:string,imageId:integer
npx sequelize-cli model:generate --name Image --attributes type:string,url:string
npx sequelize-cli model:generate --name Message --attributes message:string,senderId:integer,channelId:integer,imageId:integer,dmId:integer
npx sequelize-cli model:generate --name DirectMessage --attributes messageId:integer
npx sequelize-cli model:generate --name Channel --attributes channel_name:string,serverId:integer
