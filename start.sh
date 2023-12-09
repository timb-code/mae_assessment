#!/bin/sh

# if [ -n ${RUN_TWO} ]
if [ ${RUN_TWO} == "1" ]
then
	echo ${RUN_TWO}
    sh commandTwo.sh
fi

exec npm run dev
