#!/usr/bin/env python
#coding=utf8
import urllib2
import time
import threading
import Queue
import numpy
import contextlib
import sys

use_time_list = []
consumer_time_list = []

#http api 测试类
class http_test():
    """docstring for http_test"""
    def __init__(self, host, url, id, interval):
        # super(http_test, self).__init__()
        self.host = host
        self.url = url
        self.header = {
        'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'
        }
        self.id = id
        self.timeout = 15
        self.interval = interval

    def get(self,data=None):
        start_time = time.time()
        url = 'http://%s%s' % (self.host, self.url)
        req = urllib2.Request(
            url = url,
            headers = self.header,
            data = data
            )
        response = urllib2.urlopen(req, timeout = self.timeout)
        realsock = response.fp._sock.fp._sock
        end_time = time.time()
        used_time = end_time - start_time
        use_time_list.append(used_time)
        _result = response.read()
        realsock.close()
        response.close()
        time.sleep(self.interval)
        return _result


class manager():
    """docstring for manager"""
    def __init__(self, total_num, worker_num, host, url, interval):
        self.q = Queue.Queue()
        self.total_queue_num = total_num
        self.worker_num = worker_num
        self.host = host
        self.url = url
        self.interval = interval

    def consumer(self,id):
        consumer_start_time = time.time()
        while True:
            item = self.q.get()
            # print "consumer start"
            item.get()
            consumer_used_time = time.time() - consumer_start_time
            consumer_time_list[id] = consumer_used_time
            self.q.task_done()

    def main(self):
        for i in range(self.worker_num):
            t = threading.Thread(target=self.consumer, args=[i])
            t.daemon = True
            t.start()
        for i in range(self.total_queue_num):
            self.q.put(http_test(self.host, self.url, i, self.interval))
        self.q.join()

def report_result():
    print "\n等待输出统计..."
    request_mean_time = numpy.mean(use_time_list)
    request_max_time = numpy.max(use_time_list)
    request_min_time = numpy.min(use_time_list)
    consumer_mean_time = numpy.mean(consumer_time_list)
    consumer_max_time = numpy.max(consumer_time_list)
    consumer_min_time = numpy.min(consumer_time_list)
    print "单个请求使用时间的平均值：%s s" % request_mean_time
    print "单个请求使用时间的最大值：%s s" % request_max_time
    print "单个请求使用时间的最小值：%s s" % request_min_time
    print "每个并发队列处理的平均值：%s s" % consumer_mean_time
    print "每个并发队列处理的最大值：%s s" % consumer_max_time
    print "每个并发队列处理的最小值：%s s" % consumer_min_time

def request_progress(total_num):
    while True:
        finash_request_num = len(use_time_list)
        if finash_request_num == total_num:
            break
        else:
            print "\r当前发起请求\t %s/%s" % (finash_request_num, total_num),
            sys.stdout.flush()
        time.sleep(1)
    sys.stdout.flush()
    print "\r当前发起请求\t %s/%s" % (finash_request_num, total_num),



if __name__ == '__main__':
    #主机地址和端口
    # host = "192.168.1.50:8081"
    host = "192.168.1.141:8081"
    #http资源路径
    # url = "/api/channels"
    url = "/api/test"
    #请求总数
    total_num = 10000
    #并发数
    worker_num = 100
    #请求间隔
    interval = 1

    consumer_time_list = range(worker_num)
    r_manager = manager(total_num, worker_num, host, url, interval)
    t_procgress = threading.Thread(target=request_progress, args=[total_num])
    t_procgress.start()
    r_manager.main()
    t_procgress.join()
    report_result()

