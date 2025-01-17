import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/barelayout.vue'),
    children: [
      { path: '',
         component: () => import('pages/IndexPage.vue') 
        },
      {
        path:'/login',
        component:()=> import('pages/LoginPage.vue')
      },
      {
        path:'/home',
        component:()=> import('pages/homepage.vue')
      },
      {
        path:'/admin',
        component:()=>import('layouts/AdminLayout.vue'),
        children:[
          { path: '',
            component: () => import('pages/homepage.vue') 
           },
           {
             path:'/admin/classroom',
             children:[
               {
                 path:'',
                 component:()=>import('pages/admin/classroom/classroompage-list.vue')
               }
             ]
           }, 
           {
             path:'/admin/course',
             children:[
               {
                 path:'',
                 component:()=>import('pages/admin/course/coursepage-list.vue')
               }
             ]
           },
           {
             path:'/admin/user',
             children:[
               {
                 path:'',
                 component:()=>import('pages/admin/user/userpage-list.vue')
               }
             ]
           },
           {
             path:'/admin/department',
             children:[
               {
                 path:'',
                 component:()=>import('pages/admin/department/departmentpage-list.vue')
               }
             ]
           },
           {
             path:'/admin/major',
             children:[
               {
                 path:'',
                 component:()=>import('pages/admin/major/majorpage-list.vue')
               }
             ]
           },
           {
             path:'/admin/semester',
             children:[
               {
                 path:'',
                 component:()=>import('pages/admin/semester/semesterpage-list.vue')
               }
             ]
           },
           {
             path:'/admin/opencourse',
             children:[
               {
                 path:'',
                 component:()=>import('pages/admin/opencourse/opencoursepage-list.vue')
               },
               {
                 path:'/admin/opencourse/:id/viewstudent',
                 component:()=>import('pages/admin/opencourse/opencoursestudentpage-view.vue')
               }
             ]
           },
           {
             path:'/admin/enrollment',
             children:[
               {
                 path:'',
                 component:()=>import('pages/admin/enrollment/enrollmentpage-list.vue')
               }
             ]
           }
        ]
      },
      {
        path:'/teacher',
        component:()=>import('layouts/teacherLayout.vue'),
        children:[
          { path: '',
            component: () => import('pages/homepage.vue') 
           },
          {
            path:'/teacher/opencourse',
            children:[
              {
                path:'',
                component:()=>import('pages/teacher/opencourse/opencoursepage-list.vue')
              },
              {
                path:'/teacher/opencourse/:id/viewstudent',
                component:()=>import('pages/teacher/opencourse/opencoursestudentpage-view.vue')
              }
            ]
          }
        ]
      },
      {
        path: '/student',
        component: () => import('layouts/studentlayout.vue'),
        children: [
          {
            path: '', // Default route for /student
            component: () => import('pages/homepage.vue')
          },
          {
            path: '/teacher/opencourse', // Relative path
            children: [
              // {
              //   path: '', // Default route for /student/opencourse
              //   component: () => import('pages/student/opencourse/opencoursepage-list.vue')
              // },
              {
                path: ':id/viewstudent', // This is a relative path
                component: () => import('pages/teacher/opencourse/opencoursestudentpage-view.vue')
              }
            ]
          },
          {
            path: '/student/enrollment', // Relative path
            children: [
              {
                path: '', // Default route for /student/enrollment
                component: () => import('pages/student/enrollment/enrollmentpage.vue')
              }
            ]
          }
        ]
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
