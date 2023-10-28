import { Component, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

export default class Helper {
  static async copy(toastController: ToastController, text: string) {
    navigator.clipboard.writeText(text);
    const toast = await toastController.create({
      message: 'Copied',
      color: 'dark',
      position: 'middle',
      duration: 1000,
      animated: true
    });
    toast.present();
  }
}
