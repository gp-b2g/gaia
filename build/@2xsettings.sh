SYS=`uname -s`
EXTRA_SOURCE="build/settings.py Makefile"

# Create snapshoot of $EXTRA_SOURCE
cp 'build/settings.py' 'build/settings_tmp.py'
cp 'Makefile' 'Makefile_tmp'
echo "Extra source Snapshoot created"

#MacOSX needs to define a path with -i
if [[ "$SYS" == 'Darwin' ]];
  then
    # Searching for default background set-up
    find $EXTRA_SOURCE | xargs sed -i '' 's/\.[jpg][png][gif]/@2x&/g'
    echo "Settings @2x resources"
  else
    # Searching for default background set-up
    find $EXTRA_SOURCE | xargs sed -i 's/\.[jpg][png][gif]/@2x&/g'
    echo "Settings @2x resources"
fi
