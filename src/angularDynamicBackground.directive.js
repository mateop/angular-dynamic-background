(function () {
    'use strict';

    angular
        .module('dynamicBackground', [])
        .directive('dynamicBackground', function () {
            return {
                scope: {
                    dynamicBackground: '='
                },
                restrict: 'A',
                link: function (scope, element, attr) {
                    var rgb;
                    scope.$watch('dynamicBackground', function (newValue) {

                        if (typeof newValue == 'undefined') {
                            return;
                        }
                        var hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                        var rgbRegex = /^(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/;
                        var error = false;

                        if (hexRegex.test(newValue)) {
                            rgb = hexToRGB(newValue);
                        } else if (rgbRegex.test(newValue)) {
                            rgb = rgbToArray(newValue);
                        } else {
                            error = true;
                        }


                        if (!error) {
                            run();
                        }
                    });

                    function run() {
                        element.css('color', calculateColor());
                        element.css('backgroundColor', 'rgb(' + rgb.join(',') + ')');
                    }

                    function calculateColor() {
                        var o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);

                        if (o > 125) {
                            return '#000';
                        } else {
                            return '#fff';
                        }
                    }

                    function hexToRGB(hex) {
                        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                            return r + r + g + g + b + b;
                        });

                        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                        return result ? [
                            parseInt(result[1], 16),
                            parseInt(result[2], 16),
                            parseInt(result[3], 16)
                        ] : null;
                    }

                    function rgbToArray(rgb) {
                        return rgb.substring(4, rgb.length - 1)
                            .replace(/ /g, '')
                            .split(',');
                    }
                }
            };
        });

})();