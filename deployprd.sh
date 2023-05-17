git reset --hard origin/master
git pull
result=$(docker images -q eclinic )
if [[ -n "$result" ]]; then
echo "removing image"
docker rmi -f eclinic
else
echo "building the docker image"
docker build -t eclinic .
fi

echo "built docker images and proceeding to delete existing container"
result=$( docker ps -q -f name=eclinic )
if [[ $? -eq 0 ]]; then
echo "Removing container"
docker container rm -f eclinic
echo "Deleted the existing docker container"
else
echo "No such container"
fi

echo "Deploying the updated container"
docker run -p 3000:3000 -d eclinic
echo "Deploying the container"