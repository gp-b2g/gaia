#Clean temporal $EXTRA_SOURCE files
if [ -f 'Makefile_tmp' ];
  then
	echo "Removing @2x fixes in settings.json"
	cp 'build/settings_tmp.py' 'build/settings.py'
	cp 'Makefile_tmp' 'Makefile'
	rm 'Makefile_tmp'
	rm 'build/settings_tmp.py'
fi
