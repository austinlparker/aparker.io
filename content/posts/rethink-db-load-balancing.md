---
title: "RethinkDB Load Balancing"
date: 2018-04-14T21:39:57-04:00
type: "post"
---

Do you use [RethinkDB](https://www.rethinkdb.com)? Do you have a cluster set up? Do you want to stop crushing a random cluster node with database connections? Do you wish someone had written some simple steps on "Hey, how can I set up an ELB on AWS to load balance my client connections to my RethinkDB cluster"? Wonder no more!

Setting up a load balancer for your Rethink cluster is pretty straightforward - here's how to set it up on Amazon Web Services. These instructions assume the use of the AWS Console, but the same principle applies to the API (or Ansible, or Terraform, or whatever).

- In the EC2 Console, select 'Load Balancers'.
- Select 'Create Load Balancer'. You'll want to use classic mode. Ensure that your ELB is in the same availability zone(s) as your instances.
- Set TCP Forwarding on Port 28015. You can also forward the HTTP port, however, due to the way that the RethinkDB console uses WebSockets, your UI will not work properly through the ELB.
- Set the health check to TCP 28015 as well, and possibly increase the interval to reduce load on the DB servers.
- Save, and note the DNS name of your ELB.

Now, you can access your RethinkDB cluster through the Amazon ELB and balance incoming database connections, thus spreading out the load on your servers.