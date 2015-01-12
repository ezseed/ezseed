#!/bin/bash

################################################################################
# Replace node_modules by git repositories
# those repo are cloned in the parent directory of ezseed/ezseed
# With bash ~/forks/ezseed/test/testmode.sh , ~/forks will now list the following:
# web, watcher, database
################################################################################

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"

declare -a ezseed=(
'web'
'watcher'
'database')

for i in ${ezseed[@]}
do 

  git clone https://github.com/ezseed/ezseed-$i ../$i

  if [ -d $PWD/node_modules/ezseed-$i ]; then
    rm -rf $PWD/node_modules/ezseed-$i
  fi

  ln -sf $PWD/../$i/ $PWD/node_modules/ezseed-$i
done
