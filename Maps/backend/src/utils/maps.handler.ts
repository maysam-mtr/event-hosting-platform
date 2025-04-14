import { CustomError } from "./Response & Error Handling/custom-error"
import { toLower } from "lodash"
import { sanitizePath } from "./Helpers/helper-functions"
import { Booth, Collision, Layer, Spawn, Tileset } from "@/interfaces/map-layers.interface"
import { boothesClassName, collisionsClassName, layersClassName, spawnLocationClassName } from "@/constants"

export const getRequiredFilesFromJSONFile = (jsonData : any) : { tilesets: Set<string>, templates: Set<string> } => {
    try {

        const templatesRequired: Set<string> = new Set()
        const tilesetsRequired: Set<string> = new Set(jsonData.tilesets.map((tileset: any) => sanitizePath(tileset.source)))

        for (const layer of jsonData.layers) {
            if (layer?.class && toLower(layer.class) === toLower(boothesClassName)) {
                if (layer.layers) {
                    for (const subLayer of layer.layers) {
                        if (subLayer.objects) {
                            for (const obj of subLayer.objects) {
                                if (obj.template) {
                                    templatesRequired.add(obj.template)
                                }
                            }
                        }
                    }
                }
            }
        }

        return {
            templates: templatesRequired,
            tilesets: tilesetsRequired
        }
        
    } catch (err: any) {
        throw new CustomError("Error gathering required map files", 400)
    }
}

export const getMapComponents = (data: any) : { 
    layers: Layer[],
    collisions: Collision[],
    booths: Booth[],
    spawn: Spawn | null,
    tilesets: Tileset[],
} => {

    let layers: Layer[] = []
    let collisions: Collision[] = []
    let booths: Booth[] = []
    let spawn: Spawn | null = null
    let tilesets: Tileset[] = []

    data.tilesets.forEach((tileset: Tileset) => tilesets.push(tileset))

    data = data.layers

    data.forEach((layer: any) => {
        const layerName = toLower(layer.name)
        const layerClass = toLower(layer.class)
        
        if (layerClass === toLower(layersClassName) || layerName === toLower(layersClassName)) {
            layers = getLayers(layer)
            return
        } 
        
        if (layerClass === toLower(collisionsClassName) || layerName === toLower(collisionsClassName)) {
            collisions = getCollisions(layer)
            return
        }
        
        if (layerName === toLower(boothesClassName) || layerClass === toLower(boothesClassName)) {
            booths = getBooths(layer)
            return
        }
        
        if (layerName === toLower(spawnLocationClassName) || layerClass === toLower(spawnLocationClassName)) {
            spawn = getSpawnLocation(layer)
            return
        }

        console.warn("There is a layer not being tracked!!")
    })

    return { layers, collisions, booths, spawn, tilesets }
}

export const getLayers = (data: any) : Layer[] => {
    return data.layers.flatMap((object: Layer) => ({
        id: object.id,
        name: object.name,
        data: object.data,
        width: object.width,
        height: object.height,
        visible: object.visible,
    })) ?? []
}

export const getCollisions = (data: any) : Collision[] => {
    return data.layers.flatMap((object: Collision) => ({
        id: object.id,
        name: object.name,
        data: object.data,
        width: object.width,
        height: object.height,
        visible: object.visible
    })) ?? []
}

export const getBooths = (data: any) : Booth[] => {
    if (data.layers && Array.isArray(data.layers)) {
        return data.layers.flatMap((subLayer: any) => {
            if (subLayer.objects && Array.isArray(subLayer.objects)) {
                return subLayer.objects
              } else {
                console.warn("Unexpected subLayer structure: missing or invalid 'objects'", subLayer)
                return []
            }
        })
        
    } else {
        console.warn("Unexpected layer structure: missing or invalid 'layers'", data)
        return []
    }
}

export const getSpawnLocation = (data: any) : Spawn | null => {
    if (data.objects && Array.isArray(data.objects)) {
        return ({
            id: data.objects[0].id,
            name: data.objects[0].name,
            x: data.objects[0].x,
            y: data.objects[0].y,
        })
    } else {
        console.warn("Unexpected data structure: missing or invalid 'objects'", data)
        return null
    }
}