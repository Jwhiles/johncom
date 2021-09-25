---
title: YikesScript
date: 2021-9-25 
tags:
  - TypeScript
---
# YikesScript
Recently at work an seemingly innocuous dependecy bump caused a rash of typescript errors to appear throughout our code base. The changes seemed benign -  a new method in an internal library and a few dependabot updates to go with it. Nothing, it seemed, that should cause *these* errors:

```
src/****************.tsx:94:17 - error TS2550: Property 'allSettled'
does not exist on type 'PromiseConstructor'. 
Do you need to change your target library?
Try changing the 'lib' compiler option to 'es2020' or later.

94   await Promise.allSettled(
```
and
```

src/****************.ts:105:31 - error TS2550: Property 'flatMap'
does not exist on type '{ [key: string]: { [quay: string]: Value;
}; }[]'. 
Do you need to change your target library? 
Try changing the 'lib' compiler option to 'es2019' or later.

105   return Object.values(cache).flatMap((value) =>
                                  ~~~~~~~
```


We went through the new code with a fine tooth comb - there was
nothing that explained the appearance of there errors, and TypeScript's suggestion
to "Try changing the 'lib' compiler option to 'es2020' or later."
instantly fixed all our compilation woes. This was unsatisfying - these changes didn't
touch our typescript config. It made no sense.

Clearly something was amiss, the code was compiling before even
though it used features that our tsconfig did not support.
Really it seemed like we were just seeing errors that should 
already have been spotted.

At a loss, I did what I always do when looking for inspiration - I
start scanning through the diff of our package.lock file. I noted
which packages had changed. One jumped out - type-fest, a dependecny
of a dependency of a dependency. It provides random utility types
and it had been upgraded from `v0.20.2` to `0.21.3`. Why did it
jump out at me? I guess because we were seeing type errors, and it
contained the word type. I had no other reason to think it was
responsible as the effected code didn't use type-fest.

I navigated to github dot com - and felt slightly sick when I saw
that the latest version of type fest was `v2.3.2`. I started reading
through the changelog. I could taste copper in my mouth, and there
was an ozone smell in the air. It was a slog through boring
descriptions like "Fix export for `Get` type
([#181](https://github.com/sindresorhus/type-fest/pull/181))
[a65377b](https://github.com/sindresorhus/type-fest/commit/a65377be2fba48165c9514301b679d1f21171dbd)"
and "Reticulate Splines
([#184](https://github.com/sindresorhus/type-fest/pull/181)) [g87244n](https://github.com/sindresorhus/type-fest/commit/g87244nbe2fba48165c9514301b679d1f21171dbd)".
I wondered what the point of this library was. Then I noticed it.
Sticking out, a strange a warped PR title. "Fix TS type reference
([#187](https://github.com/sindresorhus/type-fest/pull/187))
[ed5f3d3](https://github.com/sindresorhus/type-fest/commit/ed5f3d360fc9e9275dfc193cfc3992f11e192c3c)".
With a growing sense of unease I clicked the link, and through half narrowed eyes peered into the the diff. I saw this.

```
- /// <reference lib="esnext"/>
+ /// <reference lib="es2020.bigint"/>
```

Strange - I thought. This is TypeScript related. But surely this wouldn't effect how completely unrelated code was compiled? I relaxed a little. Still not entirely reassured I decided to do a test to confirm that these changes weren't responsible. I perfomed some manual node_module surgery and reverted the change. To my utter horror everything instantly compiled. The acrid stench of chemicals in the air grew stronger. Black specks appeared in the corners of my vision. Somehow this tiny change was the root of my problems.

I had to understand what was going on. I read the [PR related to this change](https://github.com/sindresorhus/type-fest/pull/187) which led me to [this typescript issue](https://github.com/microsoft/TypeScript/issues/33901). The awful words I read swam and wavered under my eyes.

> **Expected behavior**: should produce a compile error

> **Actual behavior:**  
> It just compiles.

Yet then there was worse to come. The increasingly illegible monospace
font  explained how any typescript dependency could accidentally
or maliciously subvert the expectations of the poor fool that choose
to use it.

> This is what a lib reference _does_.

> This issue has been marked 'Working as Intended' and has seen no recent activity. It has been automatically closed for house-keeping purposes.


I slammed shut the accursed tome - it dropped from my hands and hit
the floor with a crash that seemed impossible given it's relatively
light weight. It sat inert on the floor, powerless I thought, yet
still I felt almost like it was watching me. Now I understand what
the scorch marks on the cover meant - whoever was here before me
had tried to destroy this awful knowledge - before it could it drive
another to madness. It's too late for me now - but surely I can
finish my precursors work and destroy the cursed thing before I
lose my grasp entirely. Tonight  before they come for me I'll sink it
in in the lake. I can here them approaching now - it's not too late
though. If I can just


