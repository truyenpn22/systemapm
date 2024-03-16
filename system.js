class SystemApm {
    constructor(config) {
        this.width = 1520;
        this.height = 380;
        this.timerID;
        this.idCounts = {};
        this.data = config.data;
        this.timeWarning = config.timeWarning || 8000;
        this.timeDanger = config.timeDanger || 12000;

        this.svg = d3.select("#system").attr("width", this.width).attr("height", this.height).append("g");
        this.pannelGroup = this.svg.append('g').attr("class", "pannelGroup")
        this.spaceshipGroup = this.svg.insert('g', ':first-child').attr("class", "spaceshipGroup")

        this.tablegroup = this.pannelGroup.append("g").attr("class", "table-content")
        this.progressBox = this.pannelGroup.append("g").attr("class", "progress-box")
        this.planGroup = this.spaceshipGroup.append('g').attr("class", "planGroup")
        this.blackhole = this.spaceshipGroup.append('g').attr("class", "blackhole")

        this.initializeData();
        this.createEqualizer();
        this.renderRequests();

    }


    initializeData() {
        this.pannelGroup.insert("g", ':first-child')
            .attr("transform", (d, i) => "translate(" + (i * (this.width) + ((this.width)) / 4) + ", 10)")
            .each(function (d, i) {
                d3.select(this).append("image").attr("class", "server-image").attr("xlink:href", "./img/WAS55.png");

                d3.select(this).append("circle").attr("class", "server-circle").attr("cx", 35).attr("cy", 35).attr("r", 6)
                    .attr("stroke", "#1F2544").attr("stroke-width", 0.5).attr("filter", "brightness(1.2)").attr("fill", "#53BDCF").attr("cursor", "pointer");

                d3.select(this).append("circle").attr("class", "server-circle").attr("cx", 35).attr("cy", 55).attr("r", 6)
                    .attr("stroke", "#1F2544").attr("stroke-width", 0.5).attr("filter", "brightness(1.2)").attr("fill", "#42A793").attr("cursor", "pointer");

                d3.select(this).append("text").attr("class", "server-text").attr("x", 35).attr("y", 180).attr("text-anchor", "middle").attr("fill", "#EAEAEA")
                    .attr("font-size", "16px").attr("font-weight", 700).style("text-shadow", "0px 0px 3px #ffffff").style("filter", "brightness(2)").text("WEB");
            });
    }

    createEqualizer() {
        const _w = 29;
        const colorScale = d3.scaleLinear().domain([0, 50, 100]).range(["#13e913", "#ffff00", "#ff0000"]);

        const equalizerGroup1 = this.progressBox.append("g").attr("transform", "translate(500, 35)");

        const equalizerGroup2 = this.progressBox.append("g").attr("transform", "translate(500, 338)");

        for (let index = 0; index < 100 / 3; index++) {
            const gradient = Math.round(((index + 1) * 100) / 100) * 3;
            const gradientColor = colorScale(gradient);
            const x = index * (_w + 1);

            equalizerGroup1.append("rect").attr("class", "bar").attr("x", x).attr("y", 0)
                .attr("width", _w).attr("height", 5).attr("fill", gradientColor).attr("rx", 2).attr("ry", 2)
                .attr("opacity", index > 16 ? index * 0 : 0.7).transition().duration(1000).ease(d3.easeLinear)
                .attr("opacity", index > 12 ? index * 0 : 0.7).transition().duration(1000).ease(d3.easeLinear)
                .attr("opacity", 1);

            equalizerGroup2.append("rect").attr("class", "bar").attr("x", x).attr("y", 0)
                .attr("width", _w).attr("height", 5).attr("fill", gradientColor).attr("rx", 2).attr("ry", 2)
                .attr("opacity", index > 10 ? index * 0 : 0.7).transition().duration(1000).ease(d3.easeLinear)
                .attr("opacity", index > 14 ? index * 0 : 0.7).transition().duration(1000).ease(d3.easeLinear)
                .attr("opacity", 1);
        }
        if (this.timerID) {
            clearInterval(this.timerID)
        }
        this.timerID = setInterval(() => {
            d3.selectAll(".bar").remove();
            this.createEqualizer();
        }, 2000);

    }

    performAction(action) {
        switch (action) {
            case "register":
                return 'WEB';
            case "WEB":
                return 'unregister';
            case "unregister":
                return null;
            default:
                return null;
        }
    }

    getColor(status) {
        switch (status) {
            case 'normal':
                return '#3652AD';
            case 'warning':
                return '#FFBB00';
            case 'danger':
                return '#B31312';
            default:
                return '#3652AD';
        }
    }

    transitionSpaceship(attributes, transitionParams, opacity = 1) {
        attributes.style("opacity", 0).transition().duration(500).delay(transitionParams).ease(d3.easeLinear).style("opacity", opacity)
    }

    renderRequests() {
        this.data.forEach((dataService, index) => {
            dataService.listService.forEach((service, serviceIndex) => {
                let _pl = this.planGroup.append('g')
                    .attr("transform", function () {
                        let row = Math.min(Math.floor(index / 3), 5);
                        let col = index % 5;
                        return "translate(" + col + "," + row * 50 + ")";
                    })

                _pl.append("g")
                    .attr("id", "" + service.name + "_" + service.id)
                    .attr("transform", "translate(0, 50)")
                    .each(function () {
                        d3.select(this).append("image").attr("id", "spaceship");
                        d3.select(this).append("image").attr("id", "spaceship-firer").attr("width", "50px").attr("height", "50px");
                        d3.select(this).append("text").attr("id", "spaceship-text").attr("fill", "#EAEAEA").attr("font-size", "12px").attr("text-anchor", "middle").text(service.id);
                    });
                this.moveRequest(service, index, 0, dataService, serviceIndex);

            });
        });
    }

    moveRequest(request, index, actionIndex, dataService, serviceIndex) {
        let requestImage = this.svg.select("#" + request.name + "_" + request.id);
        let action = request.actions[actionIndex];
        let nextServer = this.performAction(action);
        let nextIndex = request.actions[1].indexOf(nextServer);
        let planRect = nextIndex * (this.width) / 4;

        request.timeIn = Math.floor(Math.random() * 15000) + 1000;
        request.timeOut = Math.floor(Math.random() * 15000) + 1000;

        let groupElement = this.tablegroup.select('#rectTable-' + index);
        if (groupElement.empty()) {
            groupElement = this.tablegroup.append("g")
                .attr("id", "rectTable-" + index)
                .attr("transform", function () {
                    let row = Math.floor(index / 5);
                    let col = index % 5;
                    let translateX = col * 195;
                    let translateY = row * 70;
                    return "translate(" + translateX + "," + translateY + ")";
                });
        }

        let tableElement = this.tablegroup.select('#rectTableAm-' + index);
        if (tableElement.empty()) {
            tableElement = this.tablegroup.append('g')
                .attr("id", "rectTableAm-" + index)
                .attr("transform", function () {
                    let row = Math.floor(index / 5);
                    let col = index % 5;
                    let translateX = col * 195;
                    let translateY = row * 70;
                    return "translate(" + translateX + "," + translateY + ")";
                });
        }

        let createBlackhole = this.blackhole.append('g')
            .attr("transform", function () {
                let row = Math.min(Math.floor(index / 3), 5);
                let translateY = row * 50;
                return "translate(" + 10 + "," + translateY + ")";
            })


        let time;
        if (nextServer === "WEB") {
            time = request.timeIn;
            if (request.timeIn >= this.timeDanger) {
                request.status = "danger";
            } else if (request.timeIn >= this.timeWarning) {
                request.status = "warning";
            } else {
                request.status = "normal";
            }
        } else if (nextServer === "unregister") {
            time = request.timeOut;
            if (request.timeOut >= this.timeDanger) {
                request.status = "danger";
            } else if (request.timeOut >= this.timeWarning) {
                request.status = "warning";
            } else {
                request.status = "normal";
            }
        }


        requestImage
            .transition()
            .duration(1500)
            .delay(time)
            .ease(d3.easeLinear)
            .attr("transform", "translate(" + (planRect + 390) + ", 50)")
            .on("end", () => {

                let rectgroupElement = groupElement.select("rect").empty() ? groupElement.insert("rect", ':first-child') : groupElement.select("rect");
                let pathgroupElement = groupElement.select("path").empty() ? groupElement.append("path") : groupElement.select("path");
                let textgroupElement = groupElement.select("text").empty() ? groupElement.append("text") : groupElement.select("text");
                let circlegroupElement = groupElement.select("g").empty() ? groupElement.append("g") : groupElement.select("g");
                let rectTableElement = tableElement.select("rect").empty() ? tableElement.append("rect") : tableElement.select("rect");
                let texttableElement = tableElement.select("text").empty() ? tableElement.append("text") : tableElement.select("text");
                let lightGroup = tableElement.select("g").empty() ? tableElement.append("g") : tableElement.select("g");


                rectgroupElement.attr("x", 470).attr("y", 64).attr("width", 148).attr("height", 45)
                    .style("stroke", "white").style("fill", "#3652AD").style("filter", "drop-shadow(2px 2px 8px rgb(33, 33, 34)").style("stroke-width", 4)
                    .style("rx", 5).style("ry", 5).transition().duration(500).style("stroke-width", 1).style("fill", this.getColor(request.status));

                pathgroupElement.attr("d", `M ${500},58 h100 v6 h-115 q0,4 4,4 h107 q4,0 4,-4 v-6 Z`)
                    .attr("fill", "#EAEAEA").attr("filter", "blur(1.5px)").transition().duration(500).attr("filter", "blur(0.1px)").attr("fill", "#41c2b1")

                textgroupElement.attr("x", 480).attr("y", 92).attr("text-anchor", "start").attr("fill", "#EAEAEA")
                    .attr("font-size", "14px").attr("font-weight", 500).style("text-shadow", "3px 3px 5px black").text(request.name)

                rectTableElement.attr("x", 561).attr("y", 75).attr("width", 38).attr("height", 25)
                    .style("fill", "transparent").style("stroke", "#EAEAEA").style("stroke-width", 2).style("rx", 5).style("ry", 5)
                    .transition().duration(500).style("stroke-width", 1).style("fill", "#0C2D57");

                texttableElement.attr("x", 580).attr("y", 93)
                    .attr("text-anchor", "middle").attr("fill", "#EAEAEA").attr("font-weight", 500);

                let coordinates = [{ cx: 475, cy: 70 }, { cx: 475 + 135, cy: 70 }, { cx: 475, cy: 70 + 33 }, { cx: 475 + 135, cy: 70 + 33 }];


                coordinates.forEach(function (coord, i) {
                    const circle = circlegroupElement.select("#circle" + i);
                    if (circle.empty()) {
                        circlegroupElement.append("circle")
                            .attr("id", "circle" + i)
                            .attr("cx", coord.cx)
                            .attr("cy", coord.cy)
                            .attr("r", 0.6)
                            .style("opacity", 0)
                            .transition()
                            .duration(500)
                            .style("opacity", 1)
                            .attr("fill", "#EAEAEA");
                    }
                });

                const light = [{ cx: 562, cy: 77 }, { cx: 596, cy: 77 + 22 }, { cx: 500, cy: 65 }, { cx: 610, cy: 110 },];
                light.forEach((corner) => {
                    lightGroup.append("circle").attr("cx", corner.cx).attr("cy", corner.cy).attr("r", 3)
                        .attr("fill", "#EAEAEA").style("filter", "blur(0.4px)").style("opacity", 1).transition().duration(500).ease(d3.easeLinear)
                        .style("opacity", 0).remove()

                    lightGroup.append("path").attr("d", `M ${corner.cx - 0.8} ${corner.cy} L ${corner.cx - 5} ${corner.cy - 5} L ${corner.cx + 1.5} ${corner.cy - 1.2} Z`)
                        .attr("fill", "#EAEAEA").style("opacity", 1).transition().duration(500).ease(d3.easeLinear)
                        .style("opacity", 0).remove()

                    lightGroup.append("path").attr("d", `M ${corner.cx - 0.8} ${corner.cy} L ${corner.cx - 5} ${corner.cy + 5}  L ${corner.cx + 1.5} ${corner.cy + 1.2} Z`)
                        .attr("fill", "#EAEAEA").style("opacity", 1).transition().duration(500).ease(d3.easeLinear)
                        .style("opacity", 0).remove()

                    lightGroup.append("path").attr("d", `M ${corner.cx + 1} ${corner.cy} L ${corner.cx + 5} ${corner.cy - 5} L ${corner.cx - 1.5} ${corner.cy - 1.2} Z`)
                        .attr("fill", "#EAEAEA").style("opacity", 1).transition().duration(500).ease(d3.easeLinear)
                        .style("opacity", 0).remove()

                    lightGroup.append("path").attr("d", `M ${corner.cx - 0.2} ${corner.cy + 1} L ${corner.cx + 5} ${corner.cy + 5} L ${corner.cx + 1.5} ${corner.cy - 1.2} Z`)
                        .attr("fill", "#EAEAEA").style("opacity", 1).transition().duration(500).ease(d3.easeLinear)
                        .style("opacity", 0).remove()
                });


                if (nextServer === "WEB") {
                    let currentValue = parseInt(texttableElement.text(), 10) || 0;
                    let value = currentValue + 1
                    texttableElement.text(value).style('opacity', value === 1 ? 0 : 1);
                    tableElement.style('opacity', value === 1 ? 0 : 1);
                } else if (nextServer === "unregister") {
                    let currentValue = parseInt(texttableElement.text(), 10) || 0;
                    let value = currentValue - 1
                    texttableElement.text(value).style('opacity', value === 1 ? 0 : 1);
                    tableElement.style('opacity', value === 1 ? 0 : 1);
                    if (currentValue === 1) {
                        rectgroupElement.style("stroke", "white").style("stroke-width", 2).style("fill", "transparent").style("filter", "blur(0.6px)").style("rx", 5).style("ry", 5)
                            .transition()
                            .duration(500)
                            .ease(d3.easeLinear)
                            .on("end", function () {
                                rectgroupElement.remove()
                                pathgroupElement.remove()
                                textgroupElement.remove()
                                rectTableElement.remove()
                                texttableElement.remove()
                                circlegroupElement.remove()
                                lightGroup.remove()
                            });
                        pathgroupElement.transition().duration(200).ease(d3.easeLinear).attr("fill", "#EAEAEA").attr("filter", "blur(1.5px)");
                        rectTableElement.remove()
                        texttableElement.remove()
                        lightGroup.remove()
                        textgroupElement.remove()
                        circlegroupElement.remove()
                    }
                }

                if (actionIndex < request.actions.length - 1) {
                    this.moveRequest(request, index, actionIndex + 1, serviceIndex, dataService);
                }
            });

        if (nextServer === "unregister") {
            d3.selectAll("[id^='ellipsebr_'][id$='_" + request.id + "']").remove();
            requestImage.select("#spaceship").attr("xlink:href", "./img/img_spaceship_gl.png");
            this.transitionSpaceship(requestImage.select("#spaceship"), time);

            requestImage.select("#spaceship-text").attr("x", 60);
            this.transitionSpaceship(requestImage.select("#spaceship-text"), time);

            requestImage.select("#spaceship-firer").attr("xlink:href", "./img/fire.webp").attr("x", -15).attr("y", -78).style("transform", "rotate(90deg)").style("filter", "hue-rotate(170deg)");
            this.transitionSpaceship(requestImage.select("#spaceship-firer"), time);

            createBlackhole.append('ellipse').attr('id', 'ellipsegl_' + request.id).attr("cx", 365).attr("cy", 58).attr("rx", 5).attr("ry", 12).attr("filter", "drop-shadow(0px 0px 2px #96EFFF)")
            this.transitionSpaceship(createBlackhole.select("#ellipsegl_" + request.id), time, 0.8);

        } else if (nextServer === "WEB") {
            requestImage.select("#spaceship").attr("xlink:href", "./img/img_spaceship_br.png");
            this.transitionSpaceship(requestImage.select("#spaceship"), time);

            requestImage.select("#spaceship-text").attr("x", -30);
            this.transitionSpaceship(requestImage.select("#spaceship-text"), time);

            requestImage.select("#spaceship-firer").attr("xlink:href", "./img/fire.webp").attr("x", -35).attr("y", -50).style("transform", "rotate(-90deg)").style("filter", "hue-rotate(200deg)");
            this.transitionSpaceship(requestImage.select("#spaceship-firer"), time);

            createBlackhole.append('ellipse').attr('id', 'ellipsebr_' + request.id).attr("cx", 10).attr("cy", 58).attr("rx", 5).attr("ry", 12).attr("filter", "drop-shadow(0px 0px 3px #96EFFF)")
            this.transitionSpaceship(createBlackhole.select("#ellipsebr_" + request.id), time, 0.8);

        } else if (nextServer === null) {
            requestImage.selectAll("#spaceship, #spaceship-firer, #spaceship-text").remove();
            d3.selectAll("[id^='ellipsegl_'][id$='_" + request.id + "']").remove();
        }
    }
}