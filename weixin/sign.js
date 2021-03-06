'use strict'

/*
 * @Author: 情雨随风 
 * @Date: 2019-02-21 21:31:58 
 * @Last Modified by: Parker
 * @Last Modified time: 2019-03-02 18:52:24
 * @Type signature JSApi签名接口
 */



import { ApiAccessTicket } from './ticket'
import crypto from 'crypto'



/**
 * 获取Sign签名
 * @param { Object } ctx 完整的ctx对象
 */
export const ApiSign = async (ctx) => {
    let Ticket = await ApiAccessTicket()
    let url = ctx.request.href
    console.log(url,1)
    let noncestr = createNonce()
    let timestamp = createTimestamp()
    let signature = await createSort(noncestr, Ticket.ticket, timestamp, "http://limvc.iok.la/")
    
    return { signature, noncestr ,timestamp,ticket:Ticket.ticket }
}



/**
 * 生成随机字符串
 */
const createNonce = () => {
    return Math.random().toString(36).substr(2,15)
}



/**
 * 生成时间戳
 */
var createTimestamp = () => {
    return parseInt(new Date().getTime() / 1000,10) + ''
}



/**
 * 字典排序sha1加密返回密钥
 * @param { String } noncestr 
 * @param { String } ticket 
 * @param { String } timestamp 
 * @param { String } url 
 */
const createSort = (noncestr, ticket, timestamp, url) => {
    let SortArr = [
        'noncestr=' + noncestr,
        'jsapi_ticket=' + ticket,
        'timestamp=' + timestamp,
        'url=' + url
    ]

    let SortStr = SortArr.sort().join('&')

    //sha1加密
    let shasum = crypto.createHash('sha1')
        shasum.update(SortStr)

    return shasum.digest('hex')
}