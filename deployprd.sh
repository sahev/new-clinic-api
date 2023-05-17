git reset --hard origin/master
git pull

echo "built docker images and proceeding to delete existing container"
result=$( docker ps -q -f name=eclinic )
if [[ $? -eq 0 ]]; then
echo "Removing container"
for PORT in 3000 3001 3002
do
  echo "Looking for a container on port: ${PORT}"
  ID=$(\
    docker container ls --format="{{.ID}}\t{{.Ports}}" |\
    grep ${PORT} |\
    awk '{print $1}')
  echo "Found Container ID: ${ID}"
  echo "Stopping and removing it"
  docker container stop ${ID} && docker container rm ${ID}
done
docker rmi -f eclinic
echo "Deleted the existing docker container"
else
echo "No such container"
fi

echo "building the docker image"
docker build -t eclinic .

echo "Deploying the updated container"
docker run -p 3000:3000 -d eclinic
echo "Deploying the container"