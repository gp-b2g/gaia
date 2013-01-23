# Shared config
APPS=apps
SHARED=shared
SOURCE="$APPS $SHARED"
FOUNDFILES=build/foundfiles.txt
MATCHES=build/matched.txt
UNMATCHES=build/unmatched.txt

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

	# Clean logs
	rm -rf $FOUNDFILES
	rm -rf $MATCHES
	rm -rf $UNMATCHES
  else
  	echo "Warning: Temporal folders does not exists"
fi
