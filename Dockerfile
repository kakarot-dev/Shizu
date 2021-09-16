FROM node:16.6.0

LABEL name = "SHIZU"

RUN git clone https://github.com/aria-development/Shizu

WORKDIR /Shizu

RUN yarn install

RUN yarn build

CMD ["yarn", "start"]
