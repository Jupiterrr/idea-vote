docker rm -f meteor
docker run -d -p 3030:3000 \
  --name meteor \
  --link mongoDB:db \
  -e "MONGO_URL=mongodb://db" \
  -e "ROOT_URL=http://kithub.de:3000" \
  -v "$(pwd)":/app \
  danieldent/meteor meteor
