---
title: Bumping typefest breaks compilation
date: 2021-9-17 
tags:
  - TypeScript
draft: true
---
# Bumping typefest breaks compilation
Recently at work an seemingly innocuous dependecy bump caused a rash of typescript errors to appear throughout our code base. The changed seemed benign -  a new method in an internal library and a few dependabot changes to go with it. Nothing, it seemed, that should cause *these* errors:

# TODO - put the errors in here
**errors here**

We went through the new code with a fine tooth comb - there was nothing that should cause these errors, and TypeScript's suggestion to "Try changing the 'lib' compiler option to 'es2019' or later." instantly fixed all our compilation woes. But these changes didn't touch our typescript config. It made no sense.

Clearly something was amiss. This code was compiling before, even though we were using features that our tsconfig did not support. Really it seemed like this PR had caused existing mistakes to be properly reported, things were as they should be. But why?

At a loss, I did what I always do when looking for inspiration - I start scanning through the diff of our package.lock file. I noted which packages had changed. One jumped out - type-fest, a dependecny of a dependency of a dependency. It had been upgraded from `v0.20.2` to `0.21.3`. Why did it jump out at me? I guess because we were seeing type errors, and it contained the word type.

I navigated to github dot com - and felt slightly sick when I saw that the latest version of type fest was `v2.3.2`. I could taste copper in my mouth, and there was an ozone smell in the air. I started reading through the changelog. It was a slog through boring descriptions like "Fix export for `Get` type ([#181](https://github.com/sindresorhus/type-fest/pull/181)) [a65377b](https://github.com/sindresorhus/type-fest/commit/a65377be2fba48165c9514301b679d1f21171dbd)" and TODOANOTHEREXAMPLE. I wondered what the point of this library was. Then I noticed it. Sticking out, a strange a warped PR title. "Fix TS type reference ([#187](https://github.com/sindresorhus/type-fest/pull/187)) [ed5f3d3](https://github.com/sindresorhus/type-fest/commit/ed5f3d360fc9e9275dfc193cfc3992f11e192c3c)". 
Frantically I clicked the link, and tore into the diff. I saw this.

```
- /// <reference lib="esnext"/>
+ /// <reference lib="es2020.bigint"/>
```

Strange - I thought. This is TypeScript related. But surely this wouldn't effect how completely unrelated code was compiled? Still I decided to test it. Doing manual node_module surgery I reverted the change. Suddenly everything compiled again. The acrid stench of chemicals in the air grew stronger. Black specks appeared in the corners of my vision.

I had to understand what was going on. I read the [PR related to this change](https://github.com/sindresorhus/type-fest/pull/187) which led me to [this typescript issue](https://github.com/microsoft/TypeScript/issues/33901). The awful words I read swam and wavered under my eyes.

> **Expected behavior**: should produce a compile error

> **Actual behavior:**  
> It just compiles.

Yet then there was worse to come

> This is what a lib reference _does_.

> This issue has been marked 'Working as Intended' and has seen no recent activity. It has been automatically closed for house-keeping purposes.


I slammed shut the accursed tome - it dropped from my hands and hit the floor with a bang that seemed impossible given it's relatively light weight. It sat inert on the floor, powerless I thought, yet still I felt almost like it was watching me. Now I understand what the scorch marks on the cover meant - whoever was here before me had tried to destroy this awful knowledge - before it could it drive another to madness. It's too late for me now - but surely I can destroy the thing before I lose my grasp entirely. Tonight  before they come for me I'll drown in in the lake. I can here them approaching now - it's not too late though. If I can just


