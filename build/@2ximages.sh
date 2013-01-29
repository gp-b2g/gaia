# Parse .html files to add links to shared/screen/{type}.css

# Shared config
SYS=`uname -s`
APPS=apps
SHARED=shared
SOURCE="$APPS $SHARED"

# Create snapshoot of $APPS
rm -rf .tmp_$APPS/
cp -rf $APPS/ .tmp_$APPS/
echo "$APPS Snapshoot created"

# Create snapshoot of $SHARED
rm -rf .tmp_$SHARED/
cp -rf $SHARED/ .tmp_$SHARED/
echo "$SHARED Snapshoot created"

#MacOSX needs to define a path with -i
if [[ "$SYS" == 'Darwin' ]];
  then
    echo "Appending $SCREEN_TYPE.css link into .html files"
    find $APPS"/" -name "*.html" | xargs sed -i '' 's/<\/head>/<link rel=\"stylesheet\" href\=\"\/shared\/screens\/'$SCREEN_TYPE'.css\" >\ <\/head>/'
  else
    echo "Appending ${SCREEN_TYPE}.css link into .html files"
    find $APPS"/" -name "*.html" | xargs sed -i 's/<\/head>/<link rel=\"stylesheet\" href\=\"\/shared\/screens\/'$SCREEN_TYPE'.css\" >\ <\/head>/'
fi
