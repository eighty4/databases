_db=$1

start_postgres_container() {
  sudo docker run --rm -itd --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=PW postgres
  sleep 1
}

case $_db in
  postgres)    start_postgres_container
esac
