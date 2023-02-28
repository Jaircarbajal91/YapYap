const DirectMessagesList = ({ directMessages }) => {
  const directMessagesList = directMessages.filter((dm) => dm.ChatMembers.length > 0)
  return (
  <div className="flex flex-col items-center justify-center">
    <p className="w-full text-lightGray uppercase">Direct Messages</p>
    {directMessagesList.map((dm) => {
      console.log(dm.ChatMembers)
      return (
        <div></div>
      );
    })}
  </div>
  );
};

export default DirectMessagesList;
