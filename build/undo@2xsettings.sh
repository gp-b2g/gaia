#Clean temporal $EXTRA_SOURCE files
cp 'build/settings_tmp.py' 'build/settings.py'
cp 'Makefile_tmp' 'Makefile'
rm 'Makefile_tmp'
rm 'build/settings_tmp.py'
