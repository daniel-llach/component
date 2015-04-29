define([
    "backbone.marionette",
    "backbone.radio",
    "radio.shim",
    "text!component/templates/componentTemplate.html"
], function (Marionette, Radio, Shim, ComponentTemplate) {

    // Enviroment
    var App = new Marionette.Application();

    var ExampleLayout = Marionette.LayoutView.extend({
        el: "body",
        template: _.template("<div id=\"example\" style=\"width:100%;\"></div>"),
        className: "component"
    });

    var Target = new ExampleLayout();
    Target.addRegion("example", "#example");
    Target.render();

    // Data
    var dataComponent = [
        {
            id: "component1",
            region: "main",
            title: "El título",
            controls: [
                {
                    align: "right",
                    name: "sorting",
                    icon: "filter",
                }
            ],
            interacts: ["self", "column"], // regions
            content: [
                {
                    name: "table"
                }
            ]
        }
    ];

    // Component Module !
    App.module("Component", function(Component, App, Backbone, Marionette, $, _, dataComponent){

        // modelo
        Component.ComponentModel = Backbone.Model.extend({
            defaults: {
                id: "component1",
                region: "main",
                title: "El título",
                controls: [
                    {
                        align: "right",
                        name: "sorting",
                        icon: "filter",
                    }
                ],
                interacts: ["self", "column"], // regions
                content: [
                    {
                        name: "table"
                    }
                ]
            }
        });

        // Component layout
        Component.ComponentLayoutView = Marionette.LayoutView.extend({
            tagName: "div",
            className: "component",
            template: _.template(ComponentTemplate),

            regions: {
                controls: ".controls",
                content: ".content"
            },

            onRender: function(){
                console.log("component: render");

                var dataModel = new Component.ComponentModel(dataComponent);
                // this.component.show(dataModel);
                console.log("dataModel: ", dataModel);
            }

        });

        Component.addInitializer(function(){
            /* crea nueva instancia del layout desde el modulo */
            var componentLayout = new Component.ComponentLayoutView();

            /* muestra el layout en la region definida */
            Target.example.show(componentLayout);
        });
    }, dataComponent);




    return App;
});
