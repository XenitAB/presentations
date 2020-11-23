.ONESHELL:

server:
	set -e
	marp -s --theme-set ./themes/xenitab.scss -I .

generate:
	set -e
	for d in presentations/*; do
		for dd in $$d/*; do
			marp $$dd/slide-deck.md -o website/$$dd/index.html
		done
	done
	cp -r themes website/
