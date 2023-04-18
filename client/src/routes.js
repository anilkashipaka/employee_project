import mainLogin from './components/mainLogin'
import admin from './components/login/admin'
import employee from './components/login/employeeLogin'
import HR from './components/login/HR'



export const routes = [
    {path:'/', component:mainLogin},
    {path:'/login/admin', component:admin},
    {path:'/login/employee', component:employee},
    {path:'/login/HR', component:HR}
]