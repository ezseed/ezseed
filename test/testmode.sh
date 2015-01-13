#!/bin/bash

################################################################################
# Replace node_modules by git repositories
# those repo are cloned in the parent directory of ezseed/ezseed
# With bash ~/forks/ezseed/test/testmode.sh , ~/forks will now list the following:
# web, watcher, database
################################################################################

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"
PREV="$( cd $DIR/.. && pwd )"

declare -a ezseed=(
'web'
'watcher'
'database')

for i in ${ezseed[@]}
do 

  if [ ! -d $DIR/../$i ]; then
    echo git clone https://github.com/ezseed/$i $PREV/$i
    # git clone https://github.com/ezseed/$i $PREV/$i
  fi

  if [ -d $DIR/node_modules/ezseed-$i ] && [ ! -L $DIR/node_modules/ezseed-$i ]; then
    echo rm -rf $DIR/node_modules/ezseed-$i
    # rm -rf $DIR/node_modules/ezseed-$i
  fi

  if [ ! -L $DIR/node_modules/ezseed-$i ]; then
    echo ln -sf $PREV/$i/ $DIR/node_modules/ezseed-$i
    # ln -sf $PREV/$i/ $DIR/node_modules/ezseed-$i
  fi

  cd $PREV/$i
  npm i --verbose
  
  cd $DIR
done
