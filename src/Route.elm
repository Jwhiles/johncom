module Route exposing (Route(..), Slug(..), fromUrl, href, slugToString)

import BlogPosts
import Html exposing (Attribute)
import Html.Attributes as HAtt
import Url exposing (Url)
import Url.Builder as UB
import Url.Parser as Parser exposing ((</>), (<?>), Parser, oneOf, s)
import Url.Parser.Query as PQ


type Route
    = Home
    | BlogPost Slug
    | BlogIndex (Maybe BlogPosts.Tag)
    | PlayGround


type Slug
    = Slug String


slugToString : Slug -> String
slugToString (Slug s) =
    s


urlParser : Parser (Slug -> a) a
urlParser =
    Parser.custom "SLUG" <|
        \str ->
            if String.endsWith ".html" str then
                Just <| Slug <| String.slice 0 -5 str

            else
                Just <| Slug str


parser : Parser (Route -> a) a
parser =
    oneOf
        [ Parser.map Home Parser.top
        , Parser.map BlogPost (s "blog" </> urlParser)
        , Parser.map BlogIndex (s "blog" <?> PQ.string "tag")
        , Parser.map PlayGround (s "playground")
        ]



-- PUBLIC HELPERS


href : Route -> Attribute msg
href targetRoute =
    HAtt.href (routeToString targetRoute)


fromUrl : Url -> Maybe Route
fromUrl url =
    Parser.parse parser <| url



-- INTERNAL


routeToString : Route -> String
routeToString page =
    case page of
        Home ->
            "/"

        BlogPost slug ->
            "/" ++ String.join "/" [ "blog", slugToString slug ]

        BlogIndex mtag ->
            let
                queries =
                    case mtag of
                        Just tag ->
                            [ UB.string "tag" tag ]

                        Nothing ->
                            []
            in
            UB.absolute [ "blog" ] queries

        PlayGround ->
            "/playground"
