# Parse .html files to add links to shared/screen/{type}.css

# Shared config
SYS=`uname -s`
APPS=apps
SHARED=shared
DOG=dogfood_apps
SOURCE="$APPS $DOG"

# Create snapshoot of $DOG
rm -rf .tmp_$DOG/
cp -rf $DOG/ .tmp_$DOG/
echo "$DOG Snapshoot created"

# Create snapshoot of $APPS
rm -rf .tmp_$APPS/
cp -rf $APPS/ .tmp_$APPS/
echo "$APPS Snapshoot created"


#MacOSX needs to define a path with -i
if [[ "$SYS" == 'Darwin' ]];
  then
    echo "Appending resolution.css link into .html files"
    find $SOURCE"/" -name "*.html" | xargs sed -i '' 's/<\/head>/<link rel=\"stylesheet\" href\=\"\/shared\/style\/resolution.css\" >\ <\/head>/'
  else
    echo "Appending resolution.css link into .html files"
    find $SOURCE"/" -name "*.html" | xargs sed -i 's/<\/head>/<link rel=\"stylesheet\" href\=\"\/shared\/style\/resolution.css\" >\ <\/head>/'
fi
