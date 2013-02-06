# Shared config
APPS=apps
SHARED=shared
DOG=dogfood_apps
SOURCE="$APPS $DOG"

if [ -d .tmp_$APPS ];
  then
	# Clean temporal $APPS folders and restore intial state
	rm -rf $APPS/
	cp -rf .tmp_$APPS/ $APPS/
	rm -rf .tmp_$APPS/

	# Clean temporal $DOG folders and restore intial state
	rm -rf $DOG/
	cp -rf .tmp_$DOG/ $DOG/
	rm -rf .tmp_$DOG/
  else
  	echo "Warning: Temporal folders does not exists"
fi
