import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectsView from "@/views/ProjectsView.vue";
import TasksView from "@/views/TasksView.vue";
import AdminView from "@/views/AdminView.vue";
import AdminUsers from "@/components/admin/Users.vue";
import AdminProjects from "@/components/admin/Projects.vue";
import AdminRoles from "@/components/admin/Roles.vue";
import AddUser from "@/components/admin/AddUser.vue";
import LoginView from "@/views/LoginView.vue";
import AddProject from "@/components/admin/AddProject.vue";
import AddTask from "@/components/task/AddTask.vue";
import DashboardView from "@/views/DashboardView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: "/dashboard",
      component: DashboardView,
    },
    {
      path: "/projects",
      component: ProjectsView,
    },
    {
      path: "/tasks",
      component: TasksView,
    },
    {
      path: "/tasks/add",
      component: AddTask
    },
    {
      path: "/desks",
      component: HomeView,
    },
    {
      path: "/admin",
      component: AdminView,
      children: [
        {
          path: "users",
          component: AdminUsers
        },
        {
          path: "/users/add",
          component: AddUser
        },
        {
          path: "roles",
          component: AdminRoles
        },
        {
          path: "projects",
          component: AdminProjects
        },
        {
          path: "/projects/add",
          component: AddProject
        },
      ]
    },
  ]
})

export default router
