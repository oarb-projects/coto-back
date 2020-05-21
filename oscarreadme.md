"D:\Program Files\heroku\bin\heroku" login -i
 oscar.rosete@uabc.edu.mx
 LiaAshanti1!
"D:\Program Files\heroku\bin\heroku" git:clone -a coto-mobile

set port=3000

npm i --s mysql

git push heroku master

"D:\Program Files\heroku\bin\heroku" open

https://dashboard.heroku.com/apps/coto-mobile/deploy/heroku-git


Rutas actualizadas
https://coto-mobile.herokuapp.com/testinfo
https://coto-mobile.herokuapp.com/charts
https://coto-mobile.herokuapp.com/pareto
https://coto-mobile.herokuapp.com/summary
https://coto-mobile.herokuapp.com/login
