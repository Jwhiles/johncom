module Route exposing (Route(..), Slug(..), fromUrl, href)

import Browser.Navigation as Nav
import Html exposing (Attribute)
import Html.Attributes as HAtt
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, oneOf, s, string)


type Route
    = Home
    | Blog Slug


type Slug
    = Slug String


slugToString : Slug -> String
slugToString (Slug s) =
    s


urlParser : Parser (Slug -> a) a
urlParser =
    Parser.custom "SLUG" (\str -> Just (Slug str))


parser : Parser (Route -> a) a
parser =
    oneOf
        [ Parser.map Home Parser.top
        , Parser.map Blog (s "blog" </> urlParser)
        ]



-- PUBLIC HELPERS


href : Route -> Attribute msg
href targetRoute =
    HAtt.href (routeToString targetRoute)


replaceUrl : Nav.Key -> Route -> Cmd msg
replaceUrl key route =
    Nav.replaceUrl key (routeToString route)


fromUrl : Url -> Maybe Route
fromUrl url =
    -- The RealWorld spec treats the fragment like a path.
    -- This makes it *literally* the path, so we can proceed
    -- with parsing as if it had been a normal path all along.
    { url | path = Maybe.withDefault "" url.fragment, fragment = Nothing }
        |> Parser.parse parser



-- INTERNAL


routeToString : Route -> String
routeToString page =
    let
        pieces =
            case page of
                Home ->
                    []

                Blog slug ->
                    [ "blog", slugToString slug ]
    in
    "#/" ++ String.join "/" pieces
