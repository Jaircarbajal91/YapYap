npx sequelize-cli model:generate --name User --attributes username:string,email:string,hashedPassword:string,alias:string,image_id:integer
npx sequelize-cli model:generate --name ChatMember --attributes user_id:integer,chat_id:integer,dm_id:integer
npx sequelize-cli model:generate --name Server --attributes server_name:string,image_id:integer
npx sequelize-cli model:generate --name Image --attributes type:string,url:string
npx sequelize-cli model:generate --name Message --attributes message:string,sender_id:integer,channelId:integer,image_id:integer,dm_id:integer
npx sequelize-cli model:generate --name DirectMessage --attributes message_id:integer
npx sequelize-cli model:generate --name Channel --attributes channel_name:string,server_id:integer
