import * as pulumi from "@pulumi/pulumi";
import { Node, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface EdgeNodeResourceInputs {
  name: pulumi.Input<string>;
  ipv4: pulumi.Input<string>;
  ipv6: pulumi.Input<string>;
}

interface EdgeNodeInputs {
  name: string;
  ipv4: string;
  ipv6: string;
}

const edgeNodeProvider: pulumi.dynamic.ResourceProvider = {
  async diff(id: string, oldProps: Node, newInputs: EdgeNodeInputs) {
    const replaces: string[] = [];
    let changes = false;

    if (oldProps.name !== newInputs.name) {
      changes = true;
      replaces.push("name");
    }

    if (oldProps.ipv4 !== newInputs.ipv4) {
      changes = true;
      replaces.push("ipv4");
    }

    if (oldProps.ipv6 !== newInputs.ipv6) {
      changes = true;
      replaces.push("ipv6");
    }

    return { changes, replaces };
  },
  async create(inputs: EdgeNodeInputs) {
    const node = await prisma.node.create({
      data: {
        name: inputs.name,
        ipv4: inputs.ipv4,
        ipv6: inputs.ipv6,
      },
    });

    return { id: node.id, outs: node };
  },
  async delete(id, props: Node) {
    await prisma.node.delete({ where: { id } });
  },
};

export class EdgeNode extends pulumi.dynamic.Resource {
  constructor(
    name: string,
    args: EdgeNodeResourceInputs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(edgeNodeProvider, name, args, opts);
  }
}
