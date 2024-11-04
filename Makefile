dump_live_db:
	fly ssh sftp get /data/sqlite.db prisma/data.db

console:
	fly ssh console

