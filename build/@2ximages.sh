# Shared config
SYS=`uname -s`
APPS=apps
SHARED=shared
SOURCE="$APPS $SHARED"
FOUNDFILES=build/foundfiles.txt
MATCHES=build/matched.txt
UNMATCHES=build/unmatched.txt

# Create snapshoot of $APPS
rm -rf .tmp_$APPS/
cp -rf $APPS/ .tmp_$APPS/
echo "$APPS Snapshoot created"

# Create snapshoot of $SHARED
rm -rf .tmp_$SHARED/
cp -rf $SHARED/ .tmp_$SHARED/
echo "$SHARED Snapshoot created"

# Clean log files
echo "Cleaning old logs"
rm -rf $FOUNDFILES
rm -rf $MATCHES
rm -rf $UNMATCHES

# Get all the assets paths to test
echo "Searching assets..."
FILES=`find $SOURCE -name "*.png" -o -name "*.jpg" -o -name "*.gif"`
for f in $FILES
do
  # Remove extra @2x in the name
    ASSET=${f//@2x./.};

  # Add @2x at the end of the name
    echo "$ASSET" | sed 's/\.[jpg][png][gif]/@2x&/g' >> $FOUNDFILES
done

# Check if files exists
echo "Checking @2x assets..."
cat $FOUNDFILES | while read line
do
    if [ -f $line ];
      then
        echo "$line" >> $MATCHES
      else
        echo "$line" >> $UNMATCHES
    fi
done

# Rename all the unmatched files
echo "Renaming assets w/o @2x versions..."
cat $UNMATCHES | while read line
do
  URLFROM=${line//@2x/}
  URLTO=$line
  mv $URLFROM $URLTO
done

#MacOSX needs to define a path with -i
if [[ "$SYS" == 'Darwin' ]];
  then
    echo "Replacing assets declarations in .css .js .html .webapp & .json files"
    find $SOURCE -name "*.css" -o -name "*.html" -o -name "*.js" -o -name "*.webapp"  -o -name "*.json" | xargs sed -i '' 's/\.[jpg][png][gif]/@2x&/g'

    echo "Appending $SCREEN_TYPE.css link into .html files"
    find $APPS"/" -name "*.html" | xargs sed -i '' 's/<\/head>/<link rel=\"stylesheet\" href\=\"\/shared\/screens\/'$SCREEN_TYPE'.css\" >\ <\/head>/'
  else
    echo "Replacing assets declarations in .css .js .html .webapp & .json files"
    find $SOURCE -name "*.css" -o -name "*.html" -o -name "*.js" -o -name "*.webapp"  -o -name "*.json" | xargs sed -i 's/\.[jpg][png][gif]/@2x&/g'

    echo "Appending ${SCREEN_TYPE}.css link into .html files"
    find $APPS"/" -name "*.html" | xargs sed -i 's/<\/head>/<link rel=\"stylesheet\" href\=\"\/shared\/screens\/'$SCREEN_TYPE'.css\" >\ <\/head>/'
fi
