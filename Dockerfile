FROM node:18-bookworm-slim

RUN apt-get update && apt-get dist-upgrade -y && apt-get install -y --no-install-recommends \
	&& apt-get clean -y \
	&& rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/
COPY ./*.sh /app/
COPY ./index.* package.json init.sql /app/

RUN cd /app/ \
	&& chmod -c 755 start.sh \
	&& sh commandOne.sh \
	&& /usr/local/bin/npm install nodemon --save-dev

WORKDIR /app/

ENTRYPOINT ["/app/start.sh"]
