.ONESHELL:

server:
	marp -s --theme-set ./themes/xenitab.scss -I .

generate:
	for d in presentations/*; do
		for dd in $$d/*; do
			echo $$dd
			marp $$dd/slide-deck.md -o website/$$dd/index.html
		done
	done
	cp -r themes website/
