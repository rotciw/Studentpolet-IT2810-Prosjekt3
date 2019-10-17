import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { decorate, observable, action, computed } from 'mobx';
import Untitled from '../Untitled';
import Viewing from '../Viewing';
import CatalogStore from '../../stores/CatalogStore';

decorate(CatalogStore, {
  catalogList: observable,
  addItem: action,
  catalogCount: computed
})

const catalogStore = new CatalogStore();

function App() {
  return (
    <div>
    <Untitled store={catalogStore}/>
    <Viewing store={catalogStore}/>
    </div>
  );
}