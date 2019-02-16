import { Honeymate } from './index.mjs'

window.Honeymate = Honeymate
document.addEventListener('DOMContentLoaded', Honeymate.initiate)
document.write('<style>.honey{opacity:0}@keyframes honeySpin{0%{transform:rotate(-360deg)}to{transform:rotate(360deg)}}</style>')
