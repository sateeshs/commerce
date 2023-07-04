FROM node:16-alpine

WORKDIR /connect

COPY . .

RUN RM .env.local
RUN mv .env.docker .env.local

RUN npm i --legacy-peer-deps

ENV AWS_BRANCH prod
ENV REGION us-est-1
ENV NODE_ENV production
ENV NEXT_TEEMETRY_DISABLED 1

RUN npm run build
#RUN npm run post-build

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]