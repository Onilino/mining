> _If you want to get started, see **README.md** file_

### DESCRIPTION

First of all, I'm sorry about the delay,
I didn't have time to start this project until this week, I've had a very busy week with my projects.
So I'm sorry about that I hope this is not too late !

To begin with, I tried to interpret the statement in the best possible way.
I wanted to do something really simple and fast, to show you a result before next year!

The goal was to show projects and documents on a map, using open-source projects.

I know I was able to take shortcuts, but I wanted it to be as efficient and smooth as possible,
and I've been very implicated in this project because I found it very interesting.

Once again, I really didn't have much time to complete this project.
Add to that the fact that I'm not a great expert in Django or React, and that I'd never developed with Next.js before, which gave me a lot of trouble lol.
I didn't have the time to train in Next.js to learn the tool's best practices, so I just started with what I had!

So you'll no doubt see some aberrations in my code (I'm fully aware of them 🤗) as well as a few errors I've never managed to get around.

No more excuses now, as I'm going to quickly walk you through the implementation of this project.

### IMPLEMENTATIONS

> _I very, VERY used to deal with ChatGPT to get many explanation, and correction to get done with it_

> _I failed to understand what was the purpose of documents, so I put their content as a **string** in database more than a real file. Sorry !_

- I knew **Leaflet**, which is an open-source map project, with which you can play easily. So I imported its plugging, named _react-leaflet_
- First of all, I created 4 Django entities: **Project**, **Company**, **Mineral**, **Document**
  with a many-to-many relationship between **Project** and all the others.
- Then, I created some seeders to get playing with some fake data structures
- I created a full-screen map app, to let the user be able to move himself
- Then, the rest of implementations was pretty easy to understand: CRUD utilities for each of 4 entities,
  drawing **Project** and **Document** on the map through **Leaflet** tools, and I think that's it !

**PS**: Sorry, because finally I did not want to take some shortcuts, I prefer when all the features I imagine are fully created !
