FROM  index.alauda.cn/csrf/nginx:latest
MAINTAINER random_ i@tmxk.org
RUN mkdir  /node \
	&& chmod 700  /node
COPY docker  /node
EXPOSE 22 3011
CMD ["node /node/main.js"]
