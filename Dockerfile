FROM fusuf/RAVANA:latest

RUN git clone https://github.com/nobody1001-sl/4.5 /root/4.5
WORKDIR /root/4.5/
ENV TZ=Europe/Istanbul
RUN npm install supervisor -g
RUN yarn install --no-audit

CMD ["node", "bot.js"]
