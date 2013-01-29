# Shared config
APPS=apps
SHARED=shared
SOURCE="$APPS $SHARED"

if [ -d .tmp_$APPS ];
  then
	# Clean temporal $APPS folders and restore intial state
	rm -rf $APPS/
	cp -rf .tmp_$APPS/ $APPS/
	rm -rf .tmp_$APPS/

	# Clean temporal $SHARED folders and restore intial state
	rm -rf $SHARED/
	cp -rf .tmp_$SHARED/ $SHARED/
	rm -rf .tmp_$SHARED/
  else
  	echo "Warning: Temporal folders does not exists"
fi
