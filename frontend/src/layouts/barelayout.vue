<template>
    <div class="q-pa-md">
      <q-layout view="hHh Lpr lff">
        <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'"> 
            <q-toolbar>
   
          <q-toolbar-title>Header</q-toolbar-title>
          <q-btn  flat to="/login">Login</q-btn>
          
        </q-toolbar> 
        </q-header>
  
        <q-page-container>
          <router-view />
        </q-page-container>
      </q-layout>
    </div>
  </template>
  