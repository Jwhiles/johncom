module Request exposing (getBlogPost)

import Http
import Route exposing (Slug, slugToString)



-- public


blogPost : Slug -> String
blogPost s =
    "/posts/" ++ slugToString s


getBlogPost : Slug -> (Result Http.Error String -> msg) -> Cmd msg
getBlogPost s m =
    Http.get { url = blogPost s, expect = Http.expectString m }
