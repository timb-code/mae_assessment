#!/bin/sh

# if [ -n ${RUN_TWO} ]
# if [ ${RUN_TWO} == "1" ]
if [ ${RUN_TWO} -eq 1 ]
then
	echo ${RUN_TWO}
    /bin/sh commandTwo.sh
fi

exec npm run dev
