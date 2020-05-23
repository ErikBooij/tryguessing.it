default: node_modules
	./node_modules/.bin/parcel build index.html

.PHONY: watch
watch: node_modules
	./node_modules/.bin/parcel index.html

node_modules: package-lock.json
	npm install

.PHONY: deploy
deploy:
	make && \
	pushd dist && \
	zip dist.zip * **/*  && \
	scp dist.zip vps:/var/www/html/tryguessing.it && \
	ssh vps "cd /var/www/html/tryguessing.it && unzip -o dist.zip" && \
	popd
