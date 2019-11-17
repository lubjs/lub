MAKEFLAGS = -j1

export NODE_ENV = test
export FORCE_COLOR = true

.PHONY: lint test ci changelog

lint:
	eslint --fix --ext .js packages/

test:
	make lint
	./scripts/test.sh

ci:
	./scripts/ci.sh

changelog:
	lerna-changelog