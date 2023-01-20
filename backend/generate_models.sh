npx sequelize-cli model:generate --name User --attributes username:string,email:string,hashedPassword:string,alias:string,image_id:integer
npx sequelize-cli model:generate --name ServerMember --attributes user_id:integer,server_id:integer
npx sequelize-cli model:generate --name DMMember --attributes user_id:integer,dm_id:integer
npx sequelize-cli model:generate --name Server --attributes server_name:string,image_id:integer,owner_id:integer
npx sequelize-cli model:generate --name Image --attributes type:string,url:string
npx sequelize-cli model:generate --name Message --attributes message:string,sender_id:integer,channel_id:integer,image_id:integer,dm_id:integer
npx sequelize-cli model:generate --name DirectMessage --attributes serial_number:integer
npx sequelize-cli model:generate --name Channel --attributes channel_name:string,server_id:integer
