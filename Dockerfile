FROM node:latest

RUN git clone https://github.com/agentmax123/4.5-1 /root/4.5
WORKDIR /root/4.5/
ENV TZ=Europe/Istanbul
RUN npm install supervisor -g
RUN yarn install --no-audit

CMD ["node", "bot.js"]
